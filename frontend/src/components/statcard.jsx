import "../styles/cards.css";

function StatCard({ title, value, detail, icon: Icon, tone = "teal" }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card-heading">
        <span>{title}</span>
        {Icon && (
          <span className="stat-card-icon" aria-hidden="true">
            <Icon />
          </span>
        )}
      </div>
      <strong>{value}</strong>
      {detail && <p>{detail}</p>}
    </article>
  );
}

export default StatCard;
