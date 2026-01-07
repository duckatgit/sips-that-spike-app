import mitt from 'mitt';

// Define the event types
type Events = {
  profileUpdated: {
    name: string;
    // email: string;
    image: string;
  };
};

export const userEvent = mitt<Events>();
