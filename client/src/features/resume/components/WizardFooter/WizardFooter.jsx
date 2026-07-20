import "./WizardFooter.css";

export default function WizardFooter({

    currentStep,

    totalSteps,

    onPrevious,

    onNext

}){

    return(

        <footer className="wizard-footer">

            <button

                onClick={onPrevious}

                disabled={currentStep===0}

            >

                Previous

            </button>

            <button

                onClick={onNext}

            >

                {

                    currentStep===totalSteps-1

                    ?

                    "Review"

                    :

                    "Next"

                }

            </button>

        </footer>

    )

}