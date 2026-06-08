const icons = {
    add: "M12 5v14M5 12h14",
    refresh: "M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4",
    copy: "M8 8h11v11H8zM5 16H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v1",
    delete: "M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3",
    close: "M6 6l12 12M18 6 6 18",
    logout: "M10 17l5-5-5-5M15 12H3M21 3v18h-8",
};

function AdminIcon({name}) {
    return (
        <svg
            className="admin-btn-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <path d={icons[name]} />
        </svg>
    );
}

export default AdminIcon;
