import "./StepProgress.css";

export default function StepProgress({

    currentStep,

    steps

}){

    return(

        <section className="step-progress">

            {

                steps.map((step,index)=>(

                    <div
                        key={step}
                        className="step-item"
                    >

                        <div

                            className={`circle

                            ${index<=currentStep?"active":""}`}

                        >

                            {index+1}

                        </div>

                        <p>

                            {step}

                        </p>

                    </div>

                ))

            }

        </section>

    )

}