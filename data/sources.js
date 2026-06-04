/**
 * Public professional sources used to assemble the product content.
 *
 * These references support the exercise selection and safety copy. They do not
 * mean that any institution has certified this app or reviewed its routines.
 */
export const SOURCES = {
  AHA_FLEXIBILITY: {
    id: "aha-flexibility",
    name: "American Heart Association - Flexibility Exercise",
    type: "guideline",
    url: "https://www.heart.org/en/healthy-living/fitness/fitness-basics/flexibility-exercise-stretching",
    reviewStatus: "primary-source",
    notes: "Hold 10-30 seconds, breathe normally, do not bounce and do not stretch to pain."
  },
  NHS_POST_EXERCISE: {
    id: "nhs-post-exercise",
    name: "NHS - How to stretch after exercising",
    type: "guideline",
    url: "https://www.nhs.uk/live-well/exercise/how-to-stretch-after-exercising/",
    reviewStatus: "primary-source",
    notes: "Post-exercise routine covering glutes, hamstrings, inner thighs, calves and thighs."
  },
  AAOS_COOLDOWN: {
    id: "aaos-cooldown",
    name: "AAOS - Warm Up, Cool Down, and Be Flexible",
    type: "guideline",
    url: "https://orthoinfo.aaos.org/en/staying-healthy/warm-up-cool-down-and-be-flexible?webid=2FDEE455",
    reviewStatus: "primary-source",
    notes: "Cooldown stretching guidance and standard supported calf, thigh and upper-body movements."
  },
  HSS_SOCCER: {
    id: "hss-soccer",
    name: "HSS - Stretching for Soccer",
    type: "sport-guideline",
    url: "https://www.hss.edu/health-library/move-better/stretching-for-soccer",
    reviewStatus: "primary-source",
    notes: "Soccer cooldown focus: quads, hips, hamstrings and calves."
  },
  ITF_TENNIS: {
    id: "itf-tennis",
    name: "ITF - Mobility and Flexibility Training in Tennis",
    type: "sport-guideline",
    url: "https://www.itftennis.com/en/news-and-media/articles/physical-conditioning-mobility-and-flexibility-training-in-tennis/",
    reviewStatus: "primary-source",
    notes: "Post-exercise static stretching for major muscle groups, generally held for 30 seconds."
  },
  BWF_INJURY_PREVENTION: {
    id: "bwf-injury-prevention",
    name: "BWF - Injury Prevention through Badminton Research",
    type: "sport-research",
    url: "https://bwfbadminton.com/news-single/2021/03/08/injury-prevention-through-badminton-research",
    reviewStatus: "primary-source",
    notes: "Badminton injury-prevention research used to identify relevant body areas."
  },
  NBA_HSS_LANDING: {
    id: "nba-hss-landing",
    name: "NBA Knicks and HSS - Jumping and Landing Techniques",
    type: "sport-guideline",
    url: "https://www.nba.com/knicks/hss-youth-safety/jumping-and-landing-techniques-what-goes-must-come-down",
    reviewStatus: "primary-source",
    notes: "Basketball jumping and landing depend on muscular control around the hips, knees and ankles."
  }
};

export function getSource(id) {
  return Object.values(SOURCES).find(s => s.id === id);
}

export function validateSources(sourceIds) {
  return sourceIds.filter(id => !getSource(id));
}
