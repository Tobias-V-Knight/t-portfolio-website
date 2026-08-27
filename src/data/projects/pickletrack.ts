import type { Project } from '../types'

const project: Project = {
  slug: 'pickletrack',
  order: 50,
  title: 'PickleTrack',
  windowTitle: 'PICKLETRACK.APP',
  oneLiner: 'Computer vision that tracks pickleball shot accuracy from ordinary match video.',
  role: 'Built it',
  status: 'Public',
  year: '2025',
  categories: ['ai-ml'],
  copyState: 'PLACEHOLDER',
  caseStudy: false,
  problem:
    'Shot accuracy is the number every player wants and nobody measures, because measuring it by hand means watching the same rally four times with a notepad. The data exists in every phone video ever shot from the fence, it is just locked in pixels.',
  built: [
    'Ball and player detection on match footage.',
    'Court mapping that turns image coordinates into real positions on a real court, which is what makes a bounce location mean something.',
    'A performance analytics layer over the tracked shots.',
  ],
  architecture:
    'Detection runs frame by frame with YOLOv8. A homography maps the detected court corners onto a known court geometry, so every detection becomes a position in feet rather than pixels. Shot events come out of the position and velocity series, and the analytics run on those events.',
  stack: ['Python', 'YOLOv8', 'OpenCV', '[ anything else worth naming ]'],
  media: [{ caption: 'Tracked rally with court overlay', tone: 'screenshot' }],
  evidence: [
    '[ Detection accuracy, and on what footage ]',
    '[ What it got wrong, and where it broke down ]',
  ],
  links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/pickletrackv2' }],
}

export default project
