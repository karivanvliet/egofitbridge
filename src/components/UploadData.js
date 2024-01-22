import { getData, retrieveDataSource, insertSteps } from '../Utility/googleFitUtil.js'

export function UploadData(props) {
    const {treadmillData, accessToken} = props;

    async function uploadData() {
        console.log(accessToken)
        document.getElementById('uploadText').className='hidden'
        document.getElementById('uploadLoading').className='loader'
        await retrieveDataSource(accessToken)

        const insertResponse = await insertSteps(treadmillData, accessToken)
        console.log(insertResponse)
        document.getElementById('uploadText').className=''
        document.getElementById('uploadLoading').className='hidden'
    }

    return (
        <button type="submit" className= "button" onClick={uploadData}><span id="uploadLoading" className="hidden"></span><span id="uploadText">Upload to GoogleFit</span></button>
    )
}