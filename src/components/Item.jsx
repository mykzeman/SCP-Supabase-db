import { Link } from "react-router-dom";
import supabase from "../supabase"
function Item({mode , scp, isAdmin, setMode }) {
  async function verify() {
    const typed = prompt("Enter the name of the SCP to confirm deletion");
    if (typed === null) return; // user cancelled
    if (typed !== scp.name) {
      alert("Delete Unsuccessful: names do not match");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("scp")
        .delete()
        .eq("id", scp.id);

      if (error) {
        console.error(error);
        alert("Delete failed: " + (error.message || JSON.stringify(error)));
        return;
      }

      alert("Delete Successful");
      // quick UI refresh; replace with a parent callback to remove the item from state if available
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }
  return (
    <>
      <div className="item" id={`${scp.id}`}>
        <img src={scp.image} alt={`image of ${scp.name}`} />
        <h2>{scp.name}</h2>
        <h3>{scp.class}</h3>
        <Link to={`/scp/${scp.id}`}><button>Read More</button></Link>
        {isAdmin && (
          <div className="admin-butts">
        <Link to={`/admin/${scp.id}`}><button className="update" onClick={()=> { if (setMode)setMode("update")}}></button></Link>
            <button className="delete" onClick={()=> {verify()}}></button>
          </div>
        )}
      </div>
    </>
  )
}
export default Item;