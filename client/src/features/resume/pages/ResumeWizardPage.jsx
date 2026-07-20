import { useState } from "react";

import StepProgress from "../components/StepProgress/StepProgress";
import StepContent from "../components/StepContent/StepContent";
import WizardFooter from "../components/WizardFooter/WizardFooter";

import "./styles/ResumeWizardPage.css";

export default function ResumeWizardPage(){

    const [currentStep,setCurrentStep] = useState(0);

    const steps = [

        "Profile",

        "Education",

        "Experience",

        "Projects",

        "Skills",

        "Achievements",

        "Certifications"

    ];

    function next(){

        if(currentStep===steps.length-1) return;

        setCurrentStep(currentStep+1);

    }

    function previous(){

        if(currentStep===0) return;

        setCurrentStep(currentStep-1);

    }

    return(

        <main className="wizard">

            <div className="wizard-body">

                <StepProgress
                    currentStep={currentStep}
                    steps={steps}
                />

                <StepContent
                    currentStep={currentStep}
                    title={steps[currentStep]}
                />

                <WizardFooter

                    currentStep={currentStep}

                    totalSteps={steps.length}

                    onNext={next}

                    onPrevious={previous}

                />

            </div>

        </main>

    )

}