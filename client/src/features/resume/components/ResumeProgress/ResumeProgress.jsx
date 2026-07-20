import { RESUME_STEPS } from "../../constants/steps";

import "./ResumeProgress.css";

export default function ResumeProgress(){

    return(

        <div className="resume-progress">

            {

                RESUME_STEPS.map((step,index)=>(

                    <div

                        key={step.id}

                        className="progress-item"

                    >

                        <div className="progress-circle">

                            {index+1}

                        </div>

                        <span>

                            {step.title}

                        </span>

                    </div>

                ))

            }

        </div>

    )

}