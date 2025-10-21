import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabase";

function Full({isAdmin}) {
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

  if (!scp) return <p>Loading...</p>;

  return (
    <main>
      <h2>{scp.name}</h2>
      <img src={scp.image} alt={scp.name} />
      <h3>{scp.class}</h3>
      <h4>Description</h4>
      <p>{scp.description}</p>
      <h4>Containment Procedures</h4>
      <p>{scp.containment}</p>
     {isAdmin && (
          <div className="admin-butts">
            <button className="update"></button>
            <button className="delete"></button>
          </div>
        )} 
    </main>
  );
}
export default Full