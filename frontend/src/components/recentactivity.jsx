import { FiCheckCircle } from "react-icons/fi";
import "../styles/activity.css";

function RecentActivity({ activities = [] }) {
  return (
    <section className="activity-panel">
      <div className="panel-heading"><div><h2>Data status</h2><p>Latest available analytical datasets</p></div></div>
      {activities.length ? <ul className="activity-list">{activities.map((activity) => <li key={activity.title}><FiCheckCircle aria-hidden="true" /><div><strong>{activity.title}</strong><span>{activity.detail}</span></div></li>)}</ul> : <p className="empty-state">No analytical datasets are available.</p>}
    </section>
  );
}

export default RecentActivity;
