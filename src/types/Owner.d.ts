interface Owner {
  _id: string;
  name: string;
  leagueId: string;
  isCommish: boolean;
}

type Password = {
  password: string;
};

type NewOwner = Omit<Owner & Password, '_id'>;
