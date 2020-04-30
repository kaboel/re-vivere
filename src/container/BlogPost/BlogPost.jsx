import React, { Component } from "react";
import "./BlogPost.css";
import Post from "../../component/BlogPost/Post";
import firebase from "firebase";
import { firebaseConfig } from "../../services/Config";

class BlogPost extends Component {
  constructor(props) {
    super(props);
    firebase.initializeApp(firebaseConfig);
    this.state = {
      listArtikel: [],
    };
  }

  ambilDataDariServerAPI = () => {
    let ref = firebase.database().ref("/");
    ref.on("value", (snapshot) => {
      const state = snapshot.val();
      this.setState(state);
    });
  };

  simpanDataKeServerAPI = () => {
    firebase.database().ref("/").set(this.state);
  };

  componentDidMount() {
    this.ambilDataDariServerAPI();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.simpanDataKeServerAPI();
    }
  }

  handleHapusArtikel = (idArtikel) => {
    const { listArtikel } = this.state;
    const newState = listArtikel.filter((data) => {
      return data.uid !== idArtikel;
    });
    this.setState({ listArtikel: newState });
  };

  handleTombolSimpan = (event) => {
    let title = this.refs.judulArtikel.value;
    let body = this.refs.isiArtikel.value;
    let uid = this.refs.uid.value;

    if (uid && title && body) {
      const { listArtikel } = this.state;
      const indeksArtikel = listArtikel.findIndex((data) => {
        return data.uid === uid;
      });
      listArtikel[indeksArtikel].title = title;
      listArtikel[indeksArtikel].body = body;
    } else if (title && body) {
      const uid = new Date().getTime().toString();
      const { listArtikel } = this.state;
      listArtikel.push({ uid, title, body });
      this.setState({ listArtikel });
    }

    this.refs.judulArtikel.value = "";
    this.refs.isiArtikel.value = "";
    this.refs.uid.value = "";
  };

  render() {
    return (
      <div className="post-artikel">
        <div className="form pb-2 border-bottom">
          <div className="form-group row"></div>
          <div className="form-group row"></div>
          <input type="hidden" name="uid" ref="uid" />
          <button
            type="submit"
            className="btn btn-primary"
            onClick={(this, this.handleTombolSimpan)}
          >
            Simpan
          </button>
        </div>
        <h2>Daftar Artikel</h2>
        {this.state.listArtikel.map((artikel) => {
          return (
            <Post
              key={artikel.uid}
              judul={artikel.title}
              isi={artikel.body}
              idArtikel={artikel.uid}
              hapusArtikel={this.handleHapusArtikel}
            />
          );
        })}
      </div>
    );
  }
}

export default BlogPost;
