import {FiPackage} from "react-icons/fi"
import {FaQuestion} from "react-icons/fa"
import {useEffect, useState} from "react";

export function NoJobsInfo({variant, margin = "my-8"}: NoJobsInfoProps) {
  let descriptionText = "";

  if (variant == "user") {
    descriptionText = "You haven't started a job so far. Make sure to join a company, launch ETS or ATS and accept a job to get started.";
  } else if (variant == "company") {
    descriptionText = "No employee has started a job for this company so far. Launch ETS or ATS and accept a job to get started.";
  }

    return (
        <div className={margin + " w-full flex justify-center"}>
            <div>
                <div className="flex justify-center">
                    <div className="relative px-2.5 pb-1 mb-2">
                        <FiPackage size={60} />
                        <FaQuestion className="absolute bottom-0 right-0 text-amber-400" size={20} />
                    </div>
                </div>
                <h1 className="font-bold text-2xl text-center">No Jobs started</h1>
                <p>{descriptionText}</p>
            </div>
        </div>
    )
}

interface NoJobsInfoProps {
  // Set variant "user" if it's used on the user dashboard or "company" for the company dashboard
  variant: "user" | "company",
  margin?: string
}