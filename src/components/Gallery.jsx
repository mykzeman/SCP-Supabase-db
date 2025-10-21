import {useState, useEffect} from "react"
import Item from "./Item";
import supabase from "../supabase";
function Gallery({ isAdmin }) {
  const [scps, setScps] = useState([]); //react hook implemented where the two states being used are scps and setScps are being set to null

  async function fetchSCPs() {// Asynchronous function to be run in the background
    const { data, error } = await supabase.from("scp").select("*"); // Wait until you get all the scps
    if (error) console.error("Error fetching SCPs:", error); // If an error occurs, display error message
    else setScps(data); // Otherwise get the scps
  }
  useEffect(() => { //When the page is loaded, it fetches the scps
    fetchSCPs();
  }, []);


  return (
    <main className="main"> {/* Main content*/}
      <div
        className="row"
        style={{
          display: "grid",
          gap: "1.5rem",
        }}
      >
        {scps.length > 0 ? (
          scps.map((scp) => <Item key={scp.id} scp={scp} isAdmin={isAdmin} />)
        ) : (
          <p>Loading SCP entries...</p>
        )}
      </div>
    </main>
  );
}
export {Gallery};