import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  ArrowRight,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Step1RegisterFood } from './Step1RegisterFood';
import { Step2Recipients } from './Step2Recipients';
import { Step3Demand } from './Step3Demand';
import { Step4Safety } from './Step4Safety';
import { Step5Planner } from './Step5Planner';
import { Step6Transport } from './Step6Transport';
import { Step7ReviewApprove } from './Step7ReviewApprove';
import { Step8Delivery } from './Step8Delivery';

export const WorkflowContainer: React.FC = () => {
  const {
    workflowStep,
    setWorkflowStep,
    workflowStepStates,
    updateStepStatus,
    setPrimaryNav,
  } = useApp();

  const handleStepClick = (targetStep: number) => {
    // Check prerequisites
    if (targetStep === 7 && !workflowStepStates[5]?.status) {
      alert('Prerequisite missing: You must generate a plan in Step 5 before reviewing Step 7.');
      return;
    }
    setWorkflowStep(targetStep);
  };

  const handleNext = () => {
    if (workflowStep < 8) {
      setWorkflowStep(workflowStep + 1);
    }
  };

  const handlePrev = () => {
    if (workflowStep > 1) {
      setWorkflowStep(workflowStep - 1);
    }
  };

  const currentStepState = workflowStepStates[workflowStep];

  return (
    <div className="space-y-6">
      {/* 8-Step Interactive Progress Component */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Redistribution Pipeline Stages
            </h2>
            <p className="text-xs text-slate-500">
              Interactive 8-step operational pipeline from supply registration to certified delivery receipt.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPrimaryNav('OVERVIEW')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded border border-slate-200"
            >
              &larr; Exit to Overview
            </button>
          </div>
        </div>

        {/* Step Progression Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => {
            const stepInfo = workflowStepStates[s];
            const isCurrent = workflowStep === s;
            const isCompleted = stepInfo?.status === 'Completed';
            const isActionReq = stepInfo?.status === 'Action Required';

            return (
              <button
                key={s}
                type="button"
                onClick={() => handleStepClick(s)}
                className={`p-2.5 text-left border rounded transition relative flex flex-col justify-between ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500 shadow-xs'
                    : isCompleted
                    ? 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50'
                    : isActionReq
                    ? 'border-amber-300 bg-amber-50/40 hover:bg-amber-50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span className={isCurrent ? 'text-blue-900' : 'text-slate-600'}>STEP {s}</span>
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {isActionReq && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                  </div>

                  <div className="text-xs font-semibold text-slate-900 line-clamp-1">
                    {s === 1 && '1. Surplus Intake'}
                    {s === 2 && '2. Recipients'}
                    {s === 3 && '3. Demand'}
                    {s === 4 && '4. Food Safety'}
                    {s === 5 && '5. Smart Planner'}
                    {s === 6 && '6. Transport'}
                    {s === 7 && '7. Review & Approve'}
                    {s === 8 && '8. Delivery Track'}
                  </div>
                </div>

                <div className="mt-2 pt-1 border-t border-slate-200/60 text-[10px] font-medium text-slate-500 uppercase">
                  {stepInfo?.status || 'Not Started'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Step Status Banner */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Step {workflowStep}: {currentStepState?.title}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">{currentStepState?.description}</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-slate-500">Status:</span>
            <span
              className={`font-semibold ${
                currentStepState?.status === 'Completed'
                  ? 'text-emerald-700'
                  : currentStepState?.status === 'Action Required'
                  ? 'text-amber-700'
                  : 'text-blue-700'
              }`}
            >
              {currentStepState?.status}
            </span>
          </div>
        </div>
      </div>

      {/* Active Step Content */}
      <div className="transition duration-150 ease-in-out">
        {workflowStep === 1 && <Step1RegisterFood onComplete={handleNext} />}
        {workflowStep === 2 && <Step2Recipients onComplete={handleNext} />}
        {workflowStep === 3 && <Step3Demand onComplete={handleNext} />}
        {workflowStep === 4 && <Step4Safety onComplete={handleNext} />}
        {workflowStep === 5 && <Step5Planner onComplete={handleNext} />}
        {workflowStep === 6 && <Step6Transport onComplete={handleNext} />}
        {workflowStep === 7 && <Step7ReviewApprove onComplete={handleNext} />}
        {workflowStep === 8 && <Step8Delivery />}
      </div>

      {/* Step Navigation Controls Footer */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <button
          type="button"
          onClick={handlePrev}
          disabled={workflowStep === 1}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded font-medium border ${
            workflowStep === 1
              ? 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous Step</span>
        </button>

        <div className="text-slate-500 font-medium">
          Step {workflowStep} of 8
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              updateStepStatus(workflowStep, 'Completed');
              handleNext();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded shadow-xs"
          >
            <span>Save &amp; Continue to Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
