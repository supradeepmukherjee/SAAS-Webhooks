import { Button } from "./ui/button"

const Pagination = (
  { currentPg, totalPgs, pgChangeHandler }
    :
    {
      currentPg: number
      totalPgs: number
      pgChangeHandler: (pg: number) => void
    }
) => (
  <div className="flex justify-center space-x-2 mt-4">
    <Button variant='outline' disabled={currentPg === 1} onClick={() => pgChangeHandler(currentPg - 1)}>
      Previous
    </Button>
    <span className="flex items-center">
      Page {currentPg} of {totalPgs}
    </span>
    <Button variant='outline' disabled={currentPg === totalPgs} onClick={() => pgChangeHandler(currentPg + 1)}>
      Next
    </Button>
  </div>
)

export default Pagination