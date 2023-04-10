const { ApolloServer, gql } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const { users, participants, events, locations } = require("./data");
const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    userName: String
  }
  type Location {
    id: ID!
    name: String
    desc: String
    lat: Float
    lng: Float
  }
  type Event {
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String
    to: String
    location_id: ID!
    user_id: ID!
    user:User
    location:Location
    participants: [Participant]
  }
  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
  }


  type Query{
    #User
    users:[User],
    user(id:ID!): User,
    #Event
    events: [Event],
    event(id:ID!):Event
    #Participant
    participants: [Participant]
    participant(id:ID!):Participant
    
  }
`;


const resolvers = {
    
    Query: {
        // User
        users: ()=> users,
        user: (parent,args)=>{
            const user = users.find((user) => user.id === parseInt(args.id));
            if(!user){
                return new Error('User not found');;                 
            }
            return user;
        },

        //Event
        events: () => events,
        event: (parent,args)=>{
            const event = events.find((event) => event.id === parseInt(args.id));
            if(!event){
                return new Error('Event not found');
            }
            return event;

        },
        
        // Participant
        participants : () => participants,
        participant: (parent,args)=>{
            const participant = participants.find((participant) => participant.id === parseInt(args.id))
            if(!participant){
                return new Error('Participant not found');
            }
            return participant;
        }
    },
    Event: {
        user : (parent)=>{
            users.find(user => user.id === parent.user_id)
        },
        participants: (parent)=>{
            participants.filter(participant => participant.event_id === parseInt(parent.id))
        },
        location: (parent)=>{
            locations.filter(location => location.id === parseInt(parent.location_id))
        }
    },

};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
});

server.listen().then(({ url }) => {
  console.log(`Apollo Server is up at ${url}`);
});
