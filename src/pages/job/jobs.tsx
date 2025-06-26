import PageBreadcrumb from "../../components/common/PageBreadCrumb";

import ThreeColumnJobGrid from "../../components/Job/job/ThreeColumnJobGrid";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { BoxIcon } from "../../icons";
import { useNavigate, useParams } from "react-router-dom";
export default function Jobs() {
  const { id } = useParams<{ id?: string }>();

  // تحويل id إلى number أو null
const bId = id ? Number(id) : 0;
const validJobId = !isNaN(bId) ? bId : null;

  const navigate = useNavigate();
  return (
    <>
      <PageMeta
        title="React.js Images Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Images page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Posts" />
    
      <div className="space-y-5 sm:space-y-6">
      <Button
              size="sm"
              variant="primary"
              startIcon={<BoxIcon className="size-5" />}
              onClick={() => navigate(`/${validJobId}/add-job`)}
            >
             Add
            </Button>
        <ComponentCard title="Posts">
          <ThreeColumnJobGrid jobId={validJobId}/>
        </ComponentCard>
      </div>
    </>
  );
}
