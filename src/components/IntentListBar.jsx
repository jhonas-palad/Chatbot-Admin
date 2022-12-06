import { Link } from 'react-router-dom'
function IntentListBar({children}) {
    return ( 
        <div 
            style={{width:'360px', borderLeft:'1px solid #eee'}}
            className="
                position-relative
                d-flex
                flex-column
                align-items-stretch
                flex-shrink-0
                border-bottom">
            <div className="
                    d-flex
                    align-items-center
                    justify-content-between
                    flex-shrink-0
                    p-3
                    link-dark
                    text-decoration-none
                    border-bottom">
                <span className="fs-5 fw-semibold">
                        List Intent
                </span>
                <Link to="new" variant="success">
                    New
                </Link>
            </div>
            <div className="
                    list-group
                    scrollarea
                    rounded-0">
                        {children}
            </div>
        </div>
     );
}

export default IntentListBar;