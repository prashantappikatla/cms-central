import { SetStateAction, useState } from "react";

const Form = () => {
    const [attachedFile, setAttachedFile] = useState(null);
    
    const handleOnChange = (e: { target: { files: SetStateAction<null>[]; }; }) => {
      if (e.target.files) {
        setAttachedFile(e.target.files[0]);
      }
    };
    
    const renderAttachedFilePreview = () => {
      return <div>{attachedFile?.name}</div>;
    };
  
    const onSubmit = e => {
      e.preventDefault();
      console.log(`file ${attachedFile?.name} was submitted`);
    };
    
    return (
      <form onSubmit={onSubmit}>
        <h2>Upload your file</h2>
        <fieldset>
          <input
            id="transactions"
            name="transactions"
            onChange={handleOnChange}
            type="file"
            />
          <label htmlFor="transactions">Select a file</label>
        </fieldset>
  
        <button disabled={!attachedFile} type="submit">Save</button>
  
        {attachedFile && renderAttachedFilePreview()}
      </form>
    );
  };


export default Form;