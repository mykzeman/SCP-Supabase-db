import { Link } from "react-router-dom";

function Item({ scp, isAdmin }) {
  return (
    <>
      <div className="item" id={`${scp.id}`}>
        <img src={scp.image} alt={`image of ${scp.name}`} />
        <h2>{scp.name}</h2>
        <h3>{scp.class}</h3>
        <p>{scp.description}</p>
        <Link to={`/scp/${scp.id}`}><button>Read More</button></Link>
        {isAdmin && (
          <div className="admin-butts">
            <button className="update"></button>
            <button className="delete"></button>
          </div>
        )}
      </div>
    </>
  )
}
export default Item;