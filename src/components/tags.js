import React from "react"
import { Badge } from 'react-bootstrap'

const Tags = ({ children }) =>
  children && (
    <div>
      {children.map(t => (
        <Badge pill variant="primary" style={{marginRight: `5px`}}>
          {t}
        </Badge>
      ))}
    </div>
  )

export default Tags