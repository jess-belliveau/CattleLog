import React, { useState } from "react"
import { Link, graphql } from "gatsby"
import Tags from "../components/tags"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Popover,Button,OverlayTrigger,Row,Form,Container,CardColumns,Card,Jumbotron } from 'react-bootstrap'

const borderColours = ["primary", "secondary", "success", "danger", "warning", "info", "dark"]

const popover = (
  <Popover id="popover-basic">
    <Popover.Title as="h3">Contribute or update a service!</Popover.Title>
    <Popover.Content>
      Head over <Link to="https://github.com/SinFulNard/CattleLog">here</Link> for 
      information on how to define your service.
    </Popover.Content>
  </Popover>
)

const Missing = () => (
  <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
    <Button variant="success">Add/Update Service</Button>
  </OverlayTrigger>
)

const ServiceIndex = props => {
  const { data } = props
  const allServices = data.allMarkdownRemark.edges
  const emptyQuery = ""
  const [state, setState] = useState({
    filteredData: [],
    query: emptyQuery,
  })
  const handleInputChange = event => {
    console.log(event.target.value)
    const query = event.target.value
    const { data } = props
    const services = data.allMarkdownRemark.edges || []
    const filteredData = services.filter(entry => {
      const { description, service, tags, team} = entry.node.frontmatter
      return (
        description.toLowerCase().includes(query.toLowerCase()) ||
        team.toLowerCase().includes(query.toLowerCase()) ||
        service.toLowerCase().includes(query.toLowerCase()) ||
        (tags &&
          tags
            .join("")
            .toLowerCase()
            .includes(query.toLowerCase()))
      )
    })
    setState({
      query,
      filteredData,
    })
  }
  const { filteredData, query } = state
  const hasSearchResults = filteredData && query !== emptyQuery
  const services = hasSearchResults ? filteredData : allServices

  return (
    <>
      <Container>
      <Jumbotron>
        <h1 style={{ textAlign: `center` }}>Service CattleLog</h1>
        <br/>
        <Container>
          <Row className="justify-content-md-center">
            <Form.Group style={{ width: `50%`}}>
              <Form.Control aria-describedby="serviceFilter" size="lg" type="text" placeholder="Filter services..." onChange={handleInputChange}/>
              <Form.Text id="serviceFilter" muted>
                Search known services by tag, description, owner etc
              </Form.Text>
            </Form.Group>
          </Row>
          <Row className="justify-content-md-center"><Missing /></Row>
        </Container>
      </Jumbotron>
      <CardColumns>
      {services.map(({ node }) => {
        const { tags, service, description, channel, chatlink, email, documentation, team, tickets} = node.frontmatter
        const random = Math.floor(Math.random() * borderColours.length)
        return (
          <Card border={borderColours[random]}>
            <Card.Header as="h3">{service}</Card.Header>
            <Card.Body>
              <Card.Title as="h6">{description}</Card.Title>
              <Card.Text>
                Owner: {team}<br/>
                <Link to={chatlink}>{channel}</Link><br/>
                <a href={`mailto:${email}`} style={{ fontSize: `75%`}}>{email}</a><br/>
                <Link to={documentation}>Docs</Link>{' '}
                <Link to={tickets}>Tickets</Link>
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Tags>{tags}</Tags>
            </Card.Footer>
          </Card>
        )
      })}
      </CardColumns>
      </Container>
    </>
  )
}
export default ServiceIndex
export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { order: DESC, fields: frontmatter___service }) {
      edges {
        node {
          id
          frontmatter {
            service
            description
            team
            channel
            chatlink
            email
            documentation
            tags
            tickets
          }
        }
      }
    }
  }
`