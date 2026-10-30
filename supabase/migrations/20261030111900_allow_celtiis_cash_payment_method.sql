-- Allow clients to declare Celtiis Cash transfers alongside existing methods.
-- Additive constraint update only: no rows, invoices, or existing declarations are changed.
alter table public.client_payment_declarations
  drop constraint client_payment_declarations_payment_method_check;

alter table public.client_payment_declarations
  add constraint client_payment_declarations_payment_method_check
  check (payment_method in ('cash', 'mtn_momo', 'moov_money', 'celtiis_cash', 'bank_transfer', 'other'));
