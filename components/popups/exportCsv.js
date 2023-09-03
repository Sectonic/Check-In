import { CSVLink } from "react-csv";

export default function ExportCSV({ setCsvExport, csvExportFilters, setCsvExportFilters, csvExportData }) {

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-xl">Export List as CSV</h3>
                <div className="bg-base-200 p-2 rounded-lg text-xs mt-2">
                    *Only the data filtered from options will be exported. Make sure your options are fit to your liking.
                </div>
                <div className="font-semibold text-lg mt-1">Include:</div>
                <div className="form-control px-10 mt-2">
                    <label className="label cursor-pointer">
                        <span className="label-text font-semibold">Attendance Rate (%)</span> 
                        <input type="checkbox" className="toggle toggle-primary" name="attendance" checked={csvExportFilters.attendance} onChange={(e) => setCsvExportFilters(prev => ({...prev, attendance: e.target.checked}))} />
                    </label>
                </div>
                <div className="form-control px-10 mt-2">
                    <label className="label cursor-pointer">
                        <span className="label-text font-semibold">Avg Submitted (min)</span> 
                        <input type="checkbox" className="toggle toggle-primary" name="submitted" checked={csvExportFilters.submitted} onChange={(e) => setCsvExportFilters(prev => ({...prev, submitted: e.target.checked}))} />
                    </label>
                </div>
                <div className="form-control px-10 mt-2">
                    <label className="label cursor-pointer">
                        <span className="label-text font-semibold">Attended</span> 
                        <input type="checkbox" className="toggle toggle-primary" name="attended" checked={csvExportFilters.attended} onChange={(e) => setCsvExportFilters(prev => ({...prev, attended: e.target.checked}))} />
                    </label>
                </div>
                <div className="form-control px-10 mt-2">
                    <label className="label cursor-pointer">
                        <span className="label-text font-semibold">Not Attended</span> 
                        <input type="checkbox" className="toggle toggle-primary" name="notAttended" checked={csvExportFilters.notAttended} onChange={(e) => setCsvExportFilters(prev => ({...prev, notAttended: e.target.checked}))} />
                    </label>
                </div>
                <div className="form-control px-10 mt-2">
                    <label className="label cursor-pointer">
                        <span className="label-text font-semibold">Hours</span> 
                        <input type="checkbox" className="toggle toggle-primary" name="hours" checked={csvExportFilters.hours} onChange={(e) => setCsvExportFilters(prev => ({...prev, hours: e.target.checked}))} />
                    </label>
                </div>
                <div className="form-control px-10 mt-2">
                    <label className="label cursor-pointer">
                        <span className="label-text font-semibold">Event Attendances</span> 
                        <input type="checkbox" className="toggle toggle-primary" name="events" checked={csvExportFilters.events} onChange={(e) => setCsvExportFilters(prev => ({...prev, events: e.target.checked}))} />
                    </label>
                </div>
                <div className="modal-action">
                    <CSVLink className="btn btn-success" data={csvExportData} filename="attendeeData.csv" enclosingCharacter={`"`}>Export</CSVLink>
                    <label className="btn btn-ghost" onClick={() => {
                        setCsvExport(false);
                    }}>Dismiss</label>
                </div>
            </div>
        </div>
    )
}