import type { Metadata } from "next";
import { ResumeDocument } from "@/components/resume-document";
import { resume } from "@/content/resume";
import { cvCopy } from "@/content/site";

export const metadata: Metadata = {
  title: cvCopy.title,
  description: cvCopy.lede,
};

export default function CvPage() {
  return (
    <div className="resume-page px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
      <ResumeDocument resume={resume} />
    </div>
  );
}
