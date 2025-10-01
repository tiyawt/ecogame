import ListByStatus from "../components/ListByStatus";

export default function ProcessPage() {
  return (
    <>
      
      <ListByStatus status="waiting" detailBasePath="/wastebank/detail/sent/transaction" />
    </>
  );
}
