import React, { useEffect } from "react"

function FlashMessages(props) {
    return (
        <div className="floating-alerts">
            {props.messages.map((msg, index) => {
                return (
                    <div key={index} className={"alert text-center floating-alert shadow-sm alert-" + ( Boolean(msg.color) ? msg.color : "success" ) }>
                        {msg.message}
                    </div>
                )
            })}
        </div>
    )
}

export default FlashMessages