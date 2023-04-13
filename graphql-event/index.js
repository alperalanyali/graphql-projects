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
  input CreateUserInput {
    userName: String!
    email:String!
  }
  input UpdateUserInput{
    userName: String
    email:String
  }
  input CreateLocation{
    name: String!
    desc: String!
    lat: Float
    lng: Float
  }
  input UpdateLocation{
    name: String
    desc: String
    lat: Float
    lng: Float
  }
  type Location {
    id: ID!
    name: String
    desc: String
    lat: Float
    lng: Float
  }
  type DeleteAllOutput{
    count:Int!
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
  input CreateParticipantInput{
    
    user_id: ID!
    event_id: ID!
  }
  input UpdateParticipantInput{
    user_id: ID
    event_id: ID
  }
    input CreateEventInput {
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: Int!
    user_id: ID!
  }
  input UpdateEventInput {
    title: String
    desc: String
    date: String
    from: String
    to: String
    location_id: Int
    user_id: ID
  }
  
  type Mutation {
    #User
    createUser(data:CreateUserInput) :User!
    updateUser(id:ID!,data:UpdateUserInput) :User!
    deleteUser(id:ID!): User!
    deleteAllUsers: DeleteAllOutput
    #Location
    createLocation(data:CreateLocation) :Location!
    updateLocation(id:ID!,data:UpdateLocation) :Location!
    deleteLocation(id:ID!): Location!
    deleteAllLocation:DeleteAllOutput
    #Participants
    createParticipant(data:CreateParticipantInput) :Participant!
    updateParticipant(id:ID!,data:UpdateParticipantInput):Participant!
    deleteParticipant(id:ID!):Participant!
    deleteAllParticipants:DeleteAllOutput!
    # Event
    createEvent(data: CreateEventInput!): Event!
    updateEvent(id: ID!, data: UpdateEventInput!): Event!
    deleteEvent(id: ID!): Event!
    deleteAllEvent: DeleteAllOutput!
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
    #Location
    locations: [Location]
    location(id:ID!):Location

  }
`;

const uid = function () {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
const resolvers = {
    Mutation:{
      // User
      createUser : (parent,{data}) =>{
          const user = {id:uid(),userName:data.userName,email:data.email};
          users.push(user);
          
          return user;
      },
      updateUser: (parent,{id,data}) =>{
        const user_index = users.findIndex(user => user.id === parseInt(id));
        console.log(user_index);
        if(user_index === -1){
          return new Error('User not found');
        }
        const updatedUser = users[user_index] = {
          ...users[user_index],
          ...data,
        };

        return updatedUser;
      },
      deleteUser: (parent,{id})=>{
        const user_index = users.findIndex(user => user.id === parseInt(id));
        if(user_index === -1){
          return new Error('User not found');
        }
        const user = users[user_index];
        users.splice(user_index,1)
        return user
      },
      deleteAllUsers : ()=>{
        const length = users.length;
        users.splice(0,length);
        return {
          count:length
        }
      },
      // Location
      createLocation :(parent,{data}) => {
        const location = {id:uid(),name:data.name,desc:data.desc,lat:data.lat,lng:data.lng};
        locations.push(location);

        return location
      },
      updateLocation:(parent,{id,data})=>{
        const location_index = locations.findIndex(location => location.id === parseInt(id));
        if(location_index === -1){
          return new Error('Location not found');     
        }
        const updatedLocation = locations[location_index] = {
          ...locations[location_index],
          ...data,
        }
        
        return updatedLocation;
        
      },  
      deleteLocation: (parent,{id}) => {
          const location_index = locations.findIndex(location => location.id === parseInt(id));
          if(location_indext === -1){
            return new Error('Location not found');
          }
          const deletedLocation = locations[location_index];
          locations.splice(location_index, 1);

          return deletedLocation;
      },
      deleteAllLocation: ()=>{
        const length = locations.length;
        locations.splice(0,length)

        return {
          count:length
        }
      },
      // Participant
      createParticipant: (parent,{data})=>{
        const participant = {id:uid(),user_id:parseInt(data.user_id),event_id:parseInt(data.event_id)};
        participants.push(participant);

        return participant
      },
      updateParticipant: (parent,{id,data})=>{
        const participant_index = participants.findIndex(participant => participant.id === id);
        if(participant_index === -1){
          return new Error('Participant not found');
        }
        const updatedParticipant = participants[participant_index] = {
        ...participants[participant_index],
        ...data
        }
      return updatedParticipant;        
      },

      deleteParticipant:(parent,{id})=>{
        let participant_index = participants.findIndex(participant => participant.id === parseInt(id));
        
      },
      // Event
    createEvent: (parent, { data }) => {
      const newEvent = { id: uuidv4(), ...data };
      events.push(newEvent);
      return newEvent;
    },
    updateEvent: (parent, { id, data }) => {
      const eventIndex = events.findIndex((event) => event.id === parseInt(id));
      if (eventIndex === -1) {
        throw new Error("Event not found.");
      }
      const updateEvent = (events[eventIndex] = {
        ...events[eventIndex],
        ...data,
      });
      return updateEvent;
    },
    deleteEvent: (parent, { id }) => {
      const eventIndex = events.findIndex((event) => event.id === parseInt(id));
      if (eventIndex === -1) {
        throw new Error("Event not found.");
      }
      const deletedEvent = events[eventIndex];
      events.splice(eventIndex, 1);
      return deletedEvent;
    },
    deleteAllEvent: () => {
      const eventLength = events.length;
      events.splice(0, eventLength);
      return {
        count: eventLength,
      };
    },
      
    },
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
        },
        locations: ()=> locations,
        location: (parent,{id})=>{
          const location = locations.find(location => location.id === parseInt(id) );
          if(!location){
            return new Error('Location not found');
          }
          return location;
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
