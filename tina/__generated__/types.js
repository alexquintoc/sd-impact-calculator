export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const UpdatePartsFragmentDoc = gql`
    fragment UpdateParts on Update {
  __typename
  title
  summary
  publishedDate
  published
  category
  featuredImage
  imageAlt
  body
  showInAnnouncementBar
  announcementText
  announcementLinkLabel
  announcementStart
  announcementEnd
  announcementPriority
}
    `;
export const PostPartsFragmentDoc = gql`
    fragment PostParts on Post {
  __typename
  title
  body
}
    `;
export const ProjectPartsFragmentDoc = gql`
    fragment ProjectParts on Project {
  __typename
  title
  description
  year
  location
  projectType
  website
  coverImage
  gallery
  pillars
  criteria
  rating
  score
  relatedBaselines
  published
  body
}
    `;
export const BaselinePartsFragmentDoc = gql`
    fragment BaselineParts on Baseline {
  __typename
  title
  slug
  summary
  projectType
  format
  region
  year
  coverImage
  gallery
  pillars
  criteria
  sdgs
  rating
  estimatedCarbonKg
  estimatedWasteKg
  estimatedLifespanUses
  recyclability
  productionAssumptions
  materialAssumptions
  transportAssumptions
  disposalAssumptions
  evidenceNotes
  sources {
    __typename
    label
    url
  }
  relatedProjects
  published
  body
}
    `;
export const UpdateDocument = gql`
    query update($relativePath: String!) {
  update(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...UpdateParts
  }
}
    ${UpdatePartsFragmentDoc}`;
export const UpdateConnectionDocument = gql`
    query updateConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: UpdateFilter) {
  updateConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...UpdateParts
      }
    }
  }
}
    ${UpdatePartsFragmentDoc}`;
export const PostDocument = gql`
    query post($relativePath: String!) {
  post(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PostParts
  }
}
    ${PostPartsFragmentDoc}`;
export const PostConnectionDocument = gql`
    query postConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PostFilter) {
  postConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PostParts
      }
    }
  }
}
    ${PostPartsFragmentDoc}`;
export const ProjectDocument = gql`
    query project($relativePath: String!) {
  project(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ProjectParts
  }
}
    ${ProjectPartsFragmentDoc}`;
export const ProjectConnectionDocument = gql`
    query projectConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ProjectFilter) {
  projectConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ProjectParts
      }
    }
  }
}
    ${ProjectPartsFragmentDoc}`;
export const BaselineDocument = gql`
    query baseline($relativePath: String!) {
  baseline(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...BaselineParts
  }
}
    ${BaselinePartsFragmentDoc}`;
export const BaselineConnectionDocument = gql`
    query baselineConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: BaselineFilter) {
  baselineConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...BaselineParts
      }
    }
  }
}
    ${BaselinePartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    update(variables, options) {
      return requester(UpdateDocument, variables, options);
    },
    updateConnection(variables, options) {
      return requester(UpdateConnectionDocument, variables, options);
    },
    post(variables, options) {
      return requester(PostDocument, variables, options);
    },
    postConnection(variables, options) {
      return requester(PostConnectionDocument, variables, options);
    },
    project(variables, options) {
      return requester(ProjectDocument, variables, options);
    },
    projectConnection(variables, options) {
      return requester(ProjectConnectionDocument, variables, options);
    },
    baseline(variables, options) {
      return requester(BaselineDocument, variables, options);
    },
    baselineConnection(variables, options) {
      return requester(BaselineConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
