import PageHeader from "@/components/PageHeader";
import NewClientForm from "@/components/NewClientForm";

export default function NewClientPage() {
  return (
    <>
      <PageHeader title="New client" description="Add a client to start building their plan" />
      <div className="flex-1 px-6 py-6 md:px-8">
        <div className="max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <NewClientForm />
        </div>
      </div>
    </>
  );
}
