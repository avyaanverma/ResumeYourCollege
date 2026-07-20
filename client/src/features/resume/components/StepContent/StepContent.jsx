import "./StepContent.css";

export default function StepContent({

    title

}){

    return(

        <section className="step-content">

            <p>

                STEP

            </p>

            <h1>

                {title}

            </h1>

            <div className="placeholder">

                Form goes here

            </div>

        </section>

    )

}