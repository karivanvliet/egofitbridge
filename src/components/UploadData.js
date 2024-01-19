import { getData, retrieveDataSource, insertSteps } from '../Utility/googleFitUtil.js'

export function UploadData(props) {
    const {treadmillData, accessToken} = props;

    async function uploadData() {
        console.log(accessToken)
        retrieveDataSource(accessToken)
        insertSteps(treadmillData, accessToken)
    }

    return (
        <input type="submit" className= "button" value="Upload to GoogleFit" onClick={uploadData}/>
    )
}