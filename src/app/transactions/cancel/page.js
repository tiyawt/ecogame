import ListByStatus from "../components/ListByStatus";

export default function ProcessPage() {
  return (
    <>
      <ListByStatus
        status="cancelled"
        detailBasePath="/wastebank/detail/sent/transaction"
      />
    </>
  );
}
