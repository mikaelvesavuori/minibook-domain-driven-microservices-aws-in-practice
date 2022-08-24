# Compute

Once again, looking at the high level requirements we want something that can run in response to events, ideally in response to REST API calls, and TODO. We have no reason to believe it should need to handle long runs, massive amounts of memory, or complex calculations.

The king of serverless compute platforms has been AWS Lambda for quite some years now. This is the platform we will use. It satisfies all the conditions mentioned above, and is possible to use in a number of languages/runtimes, including TypeScript,

NOTE  “Workflow-oriented solutions (single purpose utility functions) vs conventional entity-oriented APIs/systems and everything in between”\
