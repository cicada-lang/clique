(define zero (lambda (base step) base))
(define (add1 prev) (lambda (base step) (step prev)))
(define (which-nat n base step) (n base step))

(define one (add1 zero))
(define two (add1 one))
(define three (add1 two))
(define four (add1 three))

(define (sub1 n)
  (which-nat
   n
   zero
   (lambda (prev) prev)))

(assert-equal (sub1 three) two)
(assert-equal (sub1 two) one)
(assert-equal (sub1 one) zero)
(assert-equal (sub1 zero) zero)

(import "./fix.scm" fix)

(define (add-wrap add)
  (lambda (m n)
    (which-nat
     m
     n
     (lambda (prev) (add1 (add prev n))))))

(define add (fix add-wrap))

(assert-equal (add one one) two)
(assert-equal (add two two) four)

(define (mul-wrap mul)
  (lambda (m n)
    (which-nat
     m
     zero
     (lambda (prev) (add n (mul prev n))))))

(define mul (fix mul-wrap))

(assert-equal
 (add two two)
 (mul two two))

(assert-equal
 (mul two (mul two (mul two two)))
 (mul (mul two two) (mul two two)))
