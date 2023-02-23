<template>
  <div class="about">
    <h1>About Our Team</h1>

    <div class="techwise-project">
      <h2>TechWise Project</h2>
      <p>TechWise is a diversity, equity, and inclusion program offered by TalentSprint and supported by Google. This 18-month program identifies and empowers capable students from underrepresented groups in select colleges to get ready for high-growth tech careers.</p>
    </div>

    <div class="project-purpose">
      <h2>Project Purpose</h2>
      <p>PillPal is an advanced medication tracking application designed to streamline medication management for individuals. The purpose of this innovative tool is to enable users to effortlessly monitor their medications, ensuring compliance and ultimately leading to better health outcomes. With an intuitive calendar and a comprehensive dashboard, PillPal provides users with a clear overview of their medication regimen, allowing for easy tracking of dosage schedules. Additionally, the application's convenient medication scheduler simplifies the process of adding new medications to one's regimen, reducing the likelihood of errors or omissions. PillPal is an indispensable tool for anyone seeking to optimize their medication management, providing a user-friendly interface and advanced features to ensure accuracy and compliance.</p>
    </div>

    <div class="team-profiles">
      <div class="team-member" v-for="(member, index) in teamMembers" :key="index">
        <img :src="member.image" :alt="member.name">
        <div class="member-info">
          <div class="member-details">
            <h3>{{ member.name }}</h3>
            <div class="role">{{ member.role }}</div>
            <div class="bio">{{ member.bio }}</div>
            <div class="social-links">
              <a :href="member.linkedin" target="_blank"><img src="./assets/images/linkedin.svg"></a>
              <a :href="member.github" target="_blank"><img src="./assets/images/github.svg"></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      teamMembers: [
        {
          name: "Kobe Maristela",
          role: "Editor-in-Chief",
          bio: "I am a passionate tech enthusiast with a strong interest in computer science, coding, and cybersecurity. My drive to stay up-to-date on emerging trends and continuously improve my skills in these fields motivates me to seek out challenging projects and collaborate with like-minded professionals. I am committed to using technology to make a positive impact and excited to contribute my knowledge and expertise to innovative solutions.",
          image: "https://media.licdn.com/dms/image/C5603AQGKQ10RNOMdDw/profile-displayphoto-shrink_800_800/0/1656700526492?e=1682553600&v=beta&t=n3xM8t1x-t1VnZv4l-BwbgKZWEYgrj8JJNAru3dZVgg",
          linkedin: "https://www.linkedin.com/in/kobe-maristela/",
          github: "https://github.com/kobemaristela"
        },
        {
          name: "Nathaniel Daniel",
          role: "Senior Writer",
          bio: "I am a computer science and engineering student with a passion for exploring new technologies and a solid background in mathematics and programming. I am currently seeking an internship to further develop my skills and gain real-world experience in software development. I thrive both in team environments and as an independent contributor, and am eager to contribute to innovative projects.",
          image: "https://media.licdn.com/dms/image/C5603AQEc9IiOw1Fw0Q/profile-displayphoto-shrink_800_800/0/1533411482435?e=1682553600&v=beta&t=PNWXVKYqMpYBpfLranEglamgpWnEUpUmkZJ6J1GP_zs",
          linkedin: "https://www.linkedin.com/in/nathaniel-daniel/",
          github: "https://github.com/nathaniel-daniel"
        },
        {
          name: "Ken Escovilla",
          role: "Contributing Writer",
          bio: "I am a computer science student with a passion for robotics and automation. I am driven to explore the latest advancements in this field, and am excited about the potential for robotics to revolutionize industries and enhance our daily lives. I am eager to collaborate with others and apply my skills in software development and hardware design to create innovative solutions in robotics.",
          image: "https://media.licdn.com/dms/image/C5603AQGOBfXsKX8U5Q/profile-displayphoto-shrink_800_800/0/1636498354908?e=1682553600&v=beta&t=Uk42_jXTsHeMVGiEoKVAd6mmIxrgHAwKQoaKWU25KlM",
          linkedin: "https://www.linkedin.com/in/ken-escovilla/",
          github: "https://github.com/Kescovilla"
        },
        {
          name: "Zak Buffington",
          role: "Managing Editor",
          bio: "I am a student at DMACC enrolled in the Techwise Program supported by Google, where I am studying Computer Information Systems. I am particularly interested in the fields of Data Science and Machine Learning, and am excited about the opportunities these technologies offer to solve complex problems and drive innovation.",
          image: "https://media.licdn.com/dms/image/C5603AQHymJYBgGqLnA/profile-displayphoto-shrink_800_800/0/1663037176558?e=1682553600&v=beta&t=uOzpO32-ZmHSG04K8KjUbXgShqfDumGYuH-Ca37Lgs8",
          linkedin: "https://www.linkedin.com/in/zak-buffington/",
          github: "https://github.com/ZakBuffington"
        },
      ]
    }
  }
}
</script>

<style>
  .about {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    text-align: center;
  }

  h1 {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 40px;
  }

  h2 {
    font-size: 36px;
    font-weight: 600;
    margin-bottom: 20px;
    text-align: left;
    color: #333333;
  }

  p {
    font-size: 18px;
    margin-bottom: 30px;
    text-align: justify;
    line-height: 1.5;
    color: #666666;
  }

  .team-member {
    display: flex;
    flex-direction: row;
    margin-bottom: 40px;
  }

  .team-member img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 20px;
  }

  .member-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }

  .member-details {
    text-align: left;
    margin-bottom: 10px;
  }

  .member-details h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 5px;
    color: #333333;
  }

  .member-details .role {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 10px;
    color: #666666;
  }

  .member-details .bio {
    font-size: 16px;
    margin-bottom: 20px;
    text-align: justify;
    line-height: 1.5;
    color: #666666;
  }

  .social-links {
  display: flex;
  align-items: center;
  }

  .social-links a {
  display: inline-block;
  margin-right: 10px;
  }

  .social-links img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  }

</style>
