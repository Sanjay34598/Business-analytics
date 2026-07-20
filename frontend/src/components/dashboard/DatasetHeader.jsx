import { FiCheckCircle, FiClock, FiDatabase } from "react-icons/fi";

function DatasetHeader({
  dataset = "No Dataset",
  status = "Ready",
  lastAnalysis = "Not Available"
}) {
  return (
    <div className="dataset-header">

      <div className="dataset-card">

        <div className="dataset-icon">
          <FiDatabase />
        </div>

        <div>
          <small>ACTIVE DATASET</small>
          <h4>{dataset}</h4>
        </div>

      </div>

      <div className="dataset-card">

        <div className="dataset-icon">
          <FiCheckCircle />
        </div>

        <div>
          <small>MODEL STATUS</small>
          <h4>{status}</h4>
        </div>

      </div>

      <div className="dataset-card">

        <div className="dataset-icon">
          <FiClock />
        </div>

        <div>
          <small>LAST ANALYSIS</small>
          <h4>{lastAnalysis}</h4>
        </div>

      </div>

    </div>
  );
}

export default DatasetHeader;