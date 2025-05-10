import { Suspense } from 'react';
import ProjectPageClient from './ProjectPageClient';

export default function ProjectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectPageClient />
    </Suspense>
  );
}