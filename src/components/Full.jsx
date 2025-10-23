import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import supabase from "../supabase";

function Full({isAdmin,mode,setMode}) {
  const { id } = useParams();
  const [scp, setScp] = useState(null);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase.from("scp").select("*").eq("id", id).single();
      if (error) console.error(error);
      else setScp(data);
    }
    fetch();
  }, [id]);   
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

  if (!scp) return <p>Loading...</p>;

  return (
    <main>
      
      <img src={scp.image} alt={scp.name} id="full" />
      <h2>{scp.name}</h2>
      <h3>{scp.class}</h3>
      <h4>Description</h4>
      <p>{scp.description}</p>
      <h4>Containment Procedures</h4>
      <p>{scp.containment}</p>
     {isAdmin && (
          <div className="admin-butts">
            <Link to={`/admin/${scp.id}`}><button className="update"onClick={()=> { if (setMode)setMode("update")}}></button></Link>
            <button className="delete" onClick={()=> {verify()}}></button>
          </div>
        )} 
    </main>
  );
}
export default Full