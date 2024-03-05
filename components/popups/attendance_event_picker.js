
export default function AttendanceEventPicker({ cancelEventPicking, inTimeEvents, reoccurringMeets, getResult, eventPickingId, previousManual, setManual }) {
    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box">
                
                <div className="modal-action">
                    <label className="btn btn-error" onClick={() => {
                        cancelEventPicking();
                        if (previousManual != null) {
                            setManual(previousManual);
                        }
                    }}>Cancel</label>
                </div>
            </div>
        </div>
    )
}