
import "./RefreshButton.css";

function RefreshButton({onRefresh}) {
    return(
        <button className="manager-refresh-button" onClick={onRefresh}>
            <span className="manager-refresh-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img">
                    <path d="M20 11a8 8 0 0 0-14.9-4M4 5v5h5M4 13a8 8 0 0 0 14.9 4M20 19v-5h-5" />
                </svg>
            </span>
            <span>Refresh</span>
        </button>
    )
 }
 export default RefreshButton;
