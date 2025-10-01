import ListByStatus from "../components/ListByStatus";

export default function DonePage() {
  return (
    <>
      
      <ListByStatus status="done" detailBasePath="/wastebank/detail/sent/transaction" />
    </>
  );
}
