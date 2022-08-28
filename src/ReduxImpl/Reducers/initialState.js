export const configState = {
  caseListFilters: [false, undefined, false],//First index; isFilterOn, second; filters, third; isFilterLoading
}

export const covid_cases = {
  cases: [], selectedCovidCase: null,
  caseListPagination: {current: 1, pageSize: 15, showSizeChanger: false, position: ['bottomRight']},
}

