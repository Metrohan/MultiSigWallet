;; Multi-Signature Wallet Smart Contract

;; Error constants
(define-constant ERR-UNAUTHORIZED u100)
(define-constant ERR-THRESHOLD u101)
(define-constant ERR-INVALID-OWNER u102)
(define-constant ERR-TRANSFER u103)
(define-constant ERR-PROPOSAL-NOT-FOUND u104)
(define-constant ERR-PROPOSAL-ALREADY-EXECUTED u105)
(define-constant MAX-OWNERS u10)

;; Data variables
(define-data-var proposal-counter uint u0)
(define-data-var threshold uint u0)

;; Data maps
(define-map owners principal bool)
(define-map proposals
  { id: uint }
  {
    to: principal,
    amount: uint,
    confirmations: (list 10 principal),
    confirmation-count: uint,
    executed: bool
  }
)

;; Helper function to check if a principal is in a list
(define-private (is-member (p principal) (lst (list 10 principal)))
  (is-some (index-of lst p))
)

;; Helper function to check if caller is an owner
(define-private (is-owner (p principal))
  (default-to false (map-get? owners p))
)

;; Check if threshold is reached for a proposal
(define-private (is-threshold-reached (id uint))
  (match (map-get? proposals { id: id })
    proposal (>= (get confirmation-count proposal) (var-get threshold))
    false
  )
)

(define-private (execute-transaction (id uint))
  (let ((proposal-opt (map-get? proposals { id: id })))
    (if (is-none proposal-opt)
      (err ERR-PROPOSAL-NOT-FOUND)
      (let ((proposal (unwrap! proposal-opt (err ERR-PROPOSAL-NOT-FOUND))))
        (if (get executed proposal)
          (err ERR-PROPOSAL-ALREADY-EXECUTED)
          (begin
            (try! (as-contract (stx-transfer? (get amount proposal) tx-sender (get to proposal))))
            (map-set proposals { id: id }
              (merge proposal { executed: true })
            )
            (ok true)
          )
        )
      )
    )
  )
)

;; Add confirmation to a proposal
(define-private (append-confirmation (id uint) (p principal))
  (match (map-get? proposals { id: id })
    proposal
    (let
      (
        (confirms (get confirmations proposal))
        (conf-count (get confirmation-count proposal))
      )
      (if (is-member p confirms)
        false
        (match (as-max-len? (append confirms p) u10)
          new-confirms (begin
            (map-set proposals { id: id }
              (merge proposal {
                confirmations: new-confirms,
                confirmation-count: (+ u1 conf-count)
              })
            )
            true
          )
          false
        )
      )
    )
    false
  )
)

;; Helper function to set a single owner
(define-private (set-single-owner (owner principal))
  (map-set owners owner true)
)

;; Set multiple owners using map for iteration
(define-private (set-owners (owners-list (list 10 principal)))
  (begin
    (map set-single-owner owners-list)
    (ok true)
  )
)

(define-public (initialize (owner1 principal) (owner2 principal) (owner3 principal) (threshold-amount uint))
  (begin
    (asserts! (is-eq (var-get threshold) u0) (err ERR-UNAUTHORIZED))
    (asserts! (> threshold-amount u0) (err ERR-THRESHOLD))
    (asserts! (<= threshold-amount u3) (err ERR-THRESHOLD))
    (asserts! (> u3 u0) (err ERR-THRESHOLD))
    ;; Validate that owners are not the same and not the zero address
    (asserts! (not (is-eq owner1 owner2)) (err ERR-INVALID-OWNER))
    (asserts! (not (is-eq owner1 owner3)) (err ERR-INVALID-OWNER))
    (asserts! (not (is-eq owner2 owner3)) (err ERR-INVALID-OWNER))
    ;; Additional validation for valid principals (not zero address equivalent)
    (asserts! (not (is-eq owner1 'SP000000000000000000002Q6VF78)) (err ERR-INVALID-OWNER))
    (asserts! (not (is-eq owner2 'SP000000000000000000002Q6VF78)) (err ERR-INVALID-OWNER))
    (asserts! (not (is-eq owner3 'SP000000000000000000002Q6VF78)) (err ERR-INVALID-OWNER))

    (map-set owners owner1 true)
    (map-set owners owner2 true)
    (map-set owners owner3 true)
    
    (var-set threshold threshold-amount)
    (ok true)
  )
)

;; Propose a new transaction
(define-public (propose-transaction (to principal) (amount uint))
  (let
    (
      (id (+ (var-get proposal-counter) u1))
    )
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (asserts! (> amount u0) (err ERR-THRESHOLD))
    ;; Validate recipient is not zero address
    (asserts! (not (is-eq to 'SP000000000000000000002Q6VF78)) (err ERR-INVALID-OWNER))
    ;; Validate amount is reasonable (prevent overflow issues)
    (asserts! (<= amount u1000000000000) (err ERR-TRANSFER))
    
    (map-set proposals
      { id: id }
      {
        to: to,
        amount: amount,
        confirmations: (list tx-sender),
        confirmation-count: u1,
        executed: false
      }
    )
    (var-set proposal-counter id)
    (ok id)
  )
)

;; Confirm a transaction
(define-public (confirm-transaction (id uint))
  (begin
    ;; Validate proposal ID is within reasonable bounds
    (asserts! (> id u0) (err ERR-PROPOSAL-NOT-FOUND))
    (asserts! (<= id (var-get proposal-counter)) (err ERR-PROPOSAL-NOT-FOUND))
    
    (match (map-get? proposals { id: id })
      proposal
      (begin
        (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
        (asserts! (not (is-member tx-sender (get confirmations proposal))) (err ERR-UNAUTHORIZED))
        (asserts! (not (get executed proposal)) (err ERR-PROPOSAL-ALREADY-EXECUTED))
        (asserts! (append-confirmation id tx-sender) (err ERR-UNAUTHORIZED))
        (if (is-threshold-reached id)
          (begin
            (try! (execute-transaction id))
            (ok u1)
          )
          (ok u0)
        )
      )
      (err ERR-PROPOSAL-NOT-FOUND)
    )
  )
)

;; Read-only functions
(define-read-only (get-proposal (id uint))
  (map-get? proposals { id: id })
)

(define-read-only (get-threshold)
  (var-get threshold)
)

(define-read-only (get-proposal-count)
  (var-get proposal-counter)
)

(define-read-only (is-owner-check (p principal))
  (is-owner p)
)

(define-read-only (get-owners)
  ;; This is a simple way to check owners, in practice you'd want a more efficient method
  (ok "Use is-owner-check function to verify specific principals")
)