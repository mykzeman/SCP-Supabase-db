import React, { useState, useEffect } from 'react';
import supabase from '../supabase'
import { useParams, useNavigate } from 'react-router-dom'
function Form({mode,scp, setMode}) {
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [uploadedUrl, setUploadedUrl] = useState("");
	const { id } = useParams();
	const navigate = useNavigate();
	const [scpData, setScpData] = useState(null);

	// fetch SCP when editing (use route id or provided scp prop as fallback)
	useEffect(() => {
		async function fetchScp() {
			const targetId = id || (scp && scp.id);
			if (!targetId || mode !== 'update') return;
			const { data, error } = await supabase.from("scp").select("*").eq("id", targetId).single();
			if (error) console.error(error);
			else setScpData(data);
		}
		fetchScp();
	}, [id, mode, scp]);

	// Handle form submission.
	async function handleSubmit(e) {
		e.preventDefault();
		const form = e.target;

		// collect values
		const name = form.name.value;
		const classValue = form['class'].value;
		const description = form.description.value;
		const containment = form.containment.value;
		const fileInput = form.image;
		// prefer component state file, fallback to form file input
		const selectedFile = file || (fileInput.files && fileInput.files[0]);

		let imageUrl = mode === 'update' && (scpData || scp) ? (scpData?.image || scp?.image) : null;

		// upload image if a new file was selected
		if (selectedFile) {
			setUploading(true);
			const fileName = `${Date.now()}_${selectedFile.name}`;

			const { data: uploadData, error: uploadError } = await supabase.storage
				.from("scp-img")
				.upload(fileName, selectedFile);

			setUploading(false);

			if (uploadError) {
				console.error(uploadError);
				alert("Upload failed.");
				return;
			}

			const { data: publicUrl } = supabase.storage
				.from("scp-img")
				.getPublicUrl(fileName);

			imageUrl = publicUrl.publicUrl;
			setUploadedUrl(imageUrl);
		}

		// Prepare payload for DB (quote 'class' key)
		const payload = {
			name,
			'class': classValue,
			description,
			containment,
			image: imageUrl
		};

		// Insert or update record in 'scp' table
		const targetId = id || (scp && scp.id);
		if (mode === 'update' && targetId) {
			const { data, error } = await supabase
				.from('scp')
				.update(payload)
				.eq('id', targetId);

			if (error) {
				console.error(error);
				alert('Update failed.');
				return;
			}
		} else {
			const { data, error } = await supabase
				.from('scp')
				.insert([payload]);

			if (error) {
				console.error(error);
				alert('Insert failed.');
				return;
			}
		}

		// close form and reset
		form.reset();
		setMode && setMode(null);
		// navigate back to home/gallery
		navigate('/');
	}

  useEffect(() => {
    if (mode=== null) {
      navigate("/"); // 👈 send them back to home
    }
  }, [mode, navigate]); // runs whenever user changes

	return (
		<>
			{/* Form container */}
			<div className='formbox'>
				{/* Title shows mode (e.g., "create" or "update") */}
				<h2>{`${mode}`} Form</h2>

				{/* The form element: onSubmit uses handleSubmit to demonstrate collecting values */}
				<form method='post' onSubmit={handleSubmit}>

					{/* Name input:
						 - required
						 - use defaultValue so React initializes the input when editing (mode === 'update')
						*/}
					<label htmlFor="name">Name</label>
					<input
						id="name"
						name='name'
						type='text'
						required
						defaultValue={mode === 'update' ? (scpData?.name || scp?.name || '') : ''}
					/>

					{/* Class input (same behavior as name) */}
					<label htmlFor="class">Class</label>
					<input
						id="class"
						name='class'
						type='text'
						required
						defaultValue={mode === 'update' ? (scpData?.class || scp?.class || '') : ''}
					/>

					{/* Description textarea:
						 - required
						 - defaultValue used so the textarea is controlled initially for update mode
						*/}
					<label htmlFor="description">Description</label>
					<textarea
						id="description"
						name="description"
						required
						defaultValue={mode === 'update' ? (scpData?.description || scp?.description || '') : ''}
					/>

					{/* Containment textarea: same pattern as description */}
					<label htmlFor="containment">Containment</label>
					<textarea
						id="containment"
						name="containment"
						required
						defaultValue={mode === 'update' ? (scpData?.containment || scp?.containment || '') : ''}
					/>

					{/* Image input (track selected file in state) */}
					<label htmlFor="image">Image</label>
					<input
						id="image"
						name='image'
						type='file'
						accept="image/*"
						onChange={(e) => setFile(e.target.files && e.target.files[0])}
					/>
					{mode === 'update' && (scpData?.image || scp?.image) && (
						<div className="existing-image">
							{/* Show the existing image filename or a preview if scp.image is a URL */}
							<p>Current image: {scpData?.image || scp?.image}</p>
							{typeof (scpData?.image || scp?.image) === 'string' && (
								<img src={scpData?.image || scp?.image} alt="current" style={{ maxWidth: 200 }} />
							)}
						</div>
					)}

					{/* Submit button:
						 - type="submit" triggers the form's onSubmit handler
						*/}
					<button type="submit">Submit</button>
				</form>
			</div>
		</>
	)
}

export default Form