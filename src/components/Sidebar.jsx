import React from "react";
import { Check } from "lucide-react";

export default function Sidebar({ steps = [], activeStep = 1 }) {
  return (
    <div className="bg-white shadow-md rounded-3xl p-6 w-full">

      {/* Progress Header */}
      <h3 className="text-gray-700 font-medium mb-2">Progress</h3>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${(activeStep / steps.length) * 100}%` }}
        ></div>
      </div>

      <p className="text-right text-blue-600 mt-1 text-sm font-semibold">
        {Math.round((activeStep / steps.length) * 100)}%
      </p>

      {/* Steps */}
      <div className="mt-6 space-y-5">
        {steps.map((item, index) => {
          const stepNumber = index + 1;

          const isCompleted = stepNumber < activeStep;   // old steps
          const isActive = stepNumber === activeStep;    // current step
          //const isPending = stepNumber > activeStep;     // upcoming steps

          return (
            <div key={index} className="flex items-center gap-3">

              {/* Circle Behavior */}
              <div
                className={`
                  w-10 h-10 flex items-center justify-center rounded-full text-lg
                  ${isCompleted ? "bg-green-100" : isActive ? "bg-blue-600" : "bg-gray-100"}
                `}
              >
                {isCompleted ? (
                  <Check className="text-green-600" size={22} />
                ) : (
                  <span className={isActive ? "text-white font-semibold" : "text-gray-400"}>
                    {stepNumber}
                  </span>
                )}
              </div>

              {/* Step Label */}
              <span
                className={`
                  text-md whitespace-nowrap overflow-hidden text-ellipsis
                  ${isActive ? "text-blue-600 font-semibold" : "text-gray-600"}
                `}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
