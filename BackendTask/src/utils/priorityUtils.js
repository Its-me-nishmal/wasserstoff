export const adjustPriority = (request) => {
    // Example logic: lower response times have higher priority (lower value)
    return request.endpoint.responseTime;
};