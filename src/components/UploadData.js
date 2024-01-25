import React from 'react';
import { retrieveDataSource, insertSteps } from '../Utility/googleFitUtil';
import gfit from '../gfit_512dp.png';

function UploadData(props) {
  const {
    treadmillData, accessToken, toggleDataUpload, checkToken, handleSignOut,
  } = props;

  async function uploadData() {
    document.getElementById('uploadText').className = 'hidden';
    document.getElementById('uploadLoading').className = 'loader';
    document.getElementById('uploadErrorMessage').innerHTML = '';
    document.getElementById('uploadErrorMessage').className = 'hidden';

    try {
      await checkToken(accessToken);
      await retrieveDataSource(accessToken);
      await insertSteps(treadmillData, accessToken);
      toggleDataUpload({ ...treadmillData, uploaded: true });
      document.getElementById('uploadText').className = 'buttonDiv';
      document.getElementById('uploadLoading').className = 'hidden';
    } catch (e) {
      if (e.message === 'invalid_token') {
        document.getElementById('uploadErrorMessage').innerHTML = `Access token expired. Please re-authenticate and try again. ${e}`;
        handleSignOut();
      } else {
        document.getElementById('uploadErrorMessage').innerHTML = `An error has occurred, please try again. ${e}`;
      }
      document.getElementById('uploadErrorMessage').className = 'error';
      document.getElementById('uploadText').className = 'buttonDiv';
      document.getElementById('uploadLoading').className = 'hidden';
    }
  }

  return (
    <>
      <div>
        <p id="uploadErrorMessage" className="hidden" />
        <p id="uploadSuccessMessage" className={treadmillData.uploaded ? '' : 'hidden'}>This session has been uploaded</p>
      </div>
      <button type="submit" title={accessToken ? 'Upload steps to GoogleFit' : 'Please sign in to upload'} className={accessToken && treadmillData.steps > 0 && !treadmillData.uploaded ? 'button' : 'disabledButton'} onClick={uploadData} disabled={!(accessToken && treadmillData.steps > 0 && !treadmillData.uploaded)}>
        <span id="uploadLoading" className="hidden" />
        <div id="uploadText" className="buttonDiv">
          <img src={gfit} alt="GoogleFit Logo" />
          Upload to GoogleFit
        </div>
      </button>
    </>
  );
}

export default UploadData;
