export default function PageBtns({ cnt, page_size, setPage, page }) {
    return (
        <div className="flex justify-between">
            <button
                onClick={() => setPage(page - 1)}
                disabled={page == 0}
                className="btn btn-neutral btn-sm"
            >
                Prev
            </button>
            <button
                onClick={() => setPage(page + 1)}
                disabled={page == Math.ceil(cnt / page_size) - 1}
                className="btn btn-neutral btn-sm"
            >
                Next
            </button>
        </div>
    );
}